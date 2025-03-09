import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

// 将 JSON 数据处理为 xlsx 需要的格式
function datenum(v: any, date1904?: boolean): number {
  if (date1904) {
    v += 1462
  }
  const epoch = Date.parse(v)
  return (epoch - new Date(Date.UTC(1899, 11, 30)).getTime()) / (24 * 60 * 60 * 1000)
}

function data2ws(data: any[][]): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {}
  const range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } }
  for (let R = 0; R < data.length; ++R) {
    for (let C = 0; C < data[R].length; ++C) {
      if (range.s.r > R) {
        range.s.r = R
      }
      if (range.s.c > C) {
        range.s.c = C
      }
      if (range.e.r < R) {
        range.e.r = R
      }
      if (range.e.c < C) {
        range.e.c = C
      }
      const cell: XLSX.CellObject = { v: data[R][C] }
      if (cell.v == null) {
        continue
      }
      const cell_ref = XLSX.utils.encode_cell({ c: C, r: R })

      if (typeof cell.v === 'number') {
        cell.t = 'n'
      } else if (typeof cell.v === 'boolean') {
        cell.t = 'b'
      } else if (cell.v instanceof Date) {
        cell.t = 'n'
        cell.z = XLSX.SSF?.table[14] || 'm/d/yy'
        cell.v = datenum(cell.v)
      } else {
        cell.t = 's'
      }

      ws[cell_ref] = cell
    }
  }
  if (range.s.c < 10000000) {
    ws['!ref'] = XLSX.utils.encode_range(range)
  }
  return ws
}

// 定义 Workbook 类型
class Workbook {
  SheetNames: string[] = []
  Sheets: { [sheet: string]: XLSX.WorkSheet } = {}
}

function s2ab(s: string): ArrayBuffer {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i < s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF
  }
  return buf
}

interface ExcelExportOptions {
  th: string[]
  data: any[][]
  fileName?: string
  fileType?: string
  sheetName?: string
}

export function toExcel({
  th,
  data,
  fileName = '列表',
  fileType = 'xlsx',
  sheetName = 'sheet1',
}: ExcelExportOptions): void {
  data.unshift(th)
  const wb = new Workbook()
  const ws = data2ws(data)
  wb.SheetNames.push(sheetName)
  wb.Sheets[sheetName] = ws
  const wbout = XLSX.write(wb, { bookType: fileType as XLSX.BookType, bookSST: false, type: 'binary' })
  saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), `${fileName}.${fileType}`)
}

export function downExcel(
  ths: string[],
  fields: string[],
  fileNameValue: string,
  data: Record<string, any>[],
  sheetName: string,
): void {
  const dataValue = data.map(v => fields.map(k => v[k]))
  const fileName = `${fileNameValue}_${new Date().toISOString()}`
  toExcel({ th: ths, data: dataValue, fileName, fileType: 'xlsx', sheetName })
}

interface SheetData {
  th: string[]
  fields: string[]
  data: Record<string, any>[]
  sheetName?: string
}

export function downExcelMultipleSheets(sheetsData: SheetData[], fileNameValue: string): void {
  const wb = new Workbook()

  sheetsData.forEach((sheet, index) => {
    const data = sheet.data.map(v => sheet.fields.map(k => v[k]))
    data.unshift(sheet.th)
    const ws = data2ws(data)
    const sheetName = sheet.sheetName || `Sheet${index + 1}`
    wb.SheetNames.push(sheetName)
    wb.Sheets[sheetName] = ws
  })

  const fileName = `${fileNameValue}_${new Date().toISOString()}`
  const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' })
  saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), `${fileName}.xlsx`)
}
