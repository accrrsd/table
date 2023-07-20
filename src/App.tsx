import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { v4 } from 'uuid'
import style from './App.module.css'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { fetchInitialData } from './redux/tableSlice'
import { CELL_LIMIT_ON_PAGE } from './utils/constants'
import { filterDataByWord, sortData } from './utils/functions'

function App() {
  const dispatch = useAppDispatch()
  const tableData = useAppSelector((store) => store.tableSliceReducer)
  const [searchParams, setSearchParams] = useSearchParams()
  const [variableTableData, setVariableTableData] = useState(tableData)

  // Await data pending
  useEffect(() => {
    dispatch(fetchInitialData())
  }, [dispatch])

  // url variables
  const currentPage = searchParams.get('id')
  const numbersOfPage = Math.ceil(variableTableData.length / CELL_LIMIT_ON_PAGE)
  const arrayOfPageNumbers = new Array(numbersOfPage).fill(null).map((_, i) => i + 1)

  // sorting variables
  const [activeSorting, setActiveSorting] = useState<'id' | 'body' | 'title' | null>(null)
  const [reverseSorting, setReverseSorting] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // update data if pending
  useEffect(() => {
    if (!isSearching && variableTableData.length === 0) setVariableTableData(tableData)
  }, [tableData, variableTableData, isSearching])

  // limit currentPage by numbers of page
  useEffect(() => {
    if (Number(currentPage) > numbersOfPage) {
      setSearchParams({ id: String(Number(numbersOfPage || 1)) })
    }
  }, [currentPage, numbersOfPage, setSearchParams])

  const changeSorting = (by: typeof activeSorting) => {
    const prevActive = activeSorting
    setActiveSorting(by)
    if (activeSorting === prevActive) {
      setReverseSorting((prev2) => !prev2)
    }

    setVariableTableData((prev) => sortData(prev, by, reverseSorting))
  }

  const increasePage = () => {
    if (Number(currentPage) + 1 <= arrayOfPageNumbers.length) setSearchParams({ id: String(Number(currentPage) + 1) })
  }
  const decreasePage = () => {
    if (Number(currentPage) - 1 > 0) setSearchParams({ id: String(Number(currentPage) - 1) })
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    if (!value) {
      setVariableTableData(tableData)
      setIsSearching(false)
    } else {
      setIsSearching(true)
      setVariableTableData(() => filterDataByWord(value, tableData))
    }
  }

  return (
    <main className={style.wrapper}>
      <label htmlFor="searchBar" className={style.searchBarWrapper}>
        <input id="searchBar" type="text" className={style.searchBar} onChange={onInputChange} />
        <div className={style.searchBarIcon} />
      </label>
      <table className={style.tableWrapper}>
        <thead>
          <tr className={style.tableHeadersWrapper}>
            <th
              className={style.tableHeader}
              style={{ width: '15%' }}
              onClick={() => {
                changeSorting('id')
              }}
            >
              ID <div className={`${style.arrow} ${activeSorting === 'id' ? style.arrowActive : ''}`} />
            </th>
            <th
              className={style.tableHeader}
              style={{ width: '50%' }}
              onClick={() => {
                changeSorting('title')
              }}
            >
              Заголовок <div className={`${style.arrow} ${activeSorting === 'title' ? style.arrowActive : ''}`} />
            </th>
            <th
              className={style.tableHeader}
              style={{ width: '40%' }}
              onClick={() => {
                changeSorting('body')
              }}
            >
              Описание <div className={`${style.arrow} ${activeSorting === 'body' ? style.arrowActive : ''}`} />
            </th>
          </tr>
        </thead>
        <tbody>
          {variableTableData.map((cell, i) => {
            const start = CELL_LIMIT_ON_PAGE * (Number(currentPage) || 1) - CELL_LIMIT_ON_PAGE
            const end = start + CELL_LIMIT_ON_PAGE
            if (i < start || i + 1 > end) return null
            return (
              <tr key={v4()} className={style.tableRow}>
                <td className={style.tableRowContent} style={{ width: '15%' }}>
                  {cell.id}
                </td>
                <td className={style.tableRowContent} style={{ width: '50%' }}>
                  {cell.title}
                </td>
                <td className={style.tableRowContent} style={{ width: '50%' }}>
                  {cell.body}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className={style.bottomWrapper}>
        <button className={style.navButton} onClick={decreasePage}>
          Назад
        </button>
        <ul className={style.numbersWrapper}>
          {arrayOfPageNumbers.map((num) => (
            <li
              key={v4()}
              className={`${style.pageNumber} ${currentPage === String(num) ? style.activePageNumber : ''}`}
              onClick={() => {
                setSearchParams({ id: String(num) })
              }}
            >
              {num}
            </li>
          ))}
        </ul>
        <button className={style.navButton} onClick={increasePage}>
          Далее
        </button>
      </div>
    </main>
  )
}

export default App
