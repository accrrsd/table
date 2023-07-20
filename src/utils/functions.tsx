import { TTableCell } from '../redux/tableSlice'

export const sortData = (arr: TTableCell[], by: 'id' | 'title' | 'body' | null, reverse?: boolean) => {
  const localArr = [...arr]
  switch (by) {
    case 'id':
      localArr.sort((cell1, cell2) => cell1.id - cell2.id)
      break
    case 'title':
      localArr.sort((cell1, cell2) => cell1.title.localeCompare(cell2.title))
      break
    case 'body':
      localArr.sort((cell1, cell2) => cell1.body.localeCompare(cell2.body))
      break
    case null:
      break
  }
  if (reverse) localArr.reverse()
  return localArr
}

export const filterDataByWord = (str: string, arr: TTableCell[]) =>
  arr.filter((cell) => String(cell.id).includes(str) || cell.title.includes(str) || cell.body.includes(str))
