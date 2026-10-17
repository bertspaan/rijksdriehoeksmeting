export interface PhotoRow {
  height: number
  photos: { index: number; width: number }[]
}

export interface PhotoLayout {
  rows: PhotoRow[]
  height: number
  scroll: boolean
}

// Justified rows keep the original aspect ratios. For small sets, try row
// partitions and keep the one that displays the greatest total photo area.
export function photoLayout(ratios: number[], width: number, height: number, gap = 8): PhotoLayout {
  if (!ratios.length || width <= 0 || height <= 0) return { rows: [], height: 0, scroll: false }
  ratios = ratios.map((ratio) => Number.isFinite(ratio) && ratio > 0 ? ratio : 1)
  const count = ratios.length
  const sums = [0]
  for (const ratio of ratios) sums.push(sums[sums.length - 1] + ratio)
  const rowHeight = (start: number, end: number) =>
    Math.max(1, width - (end - start - 1) * gap) / (sums[end] - sums[start])

  function arrange(breaks: number[], fit: boolean, targetHeight = Infinity): PhotoLayout {
    let start = 0
    const heights = breaks.map((end) => {
      const value = Math.min(targetHeight, rowHeight(start, end))
      start = end
      return value
    })
    const gaps = (breaks.length - 1) * gap
    const scale = fit ? Math.min(1, Math.max(1, height - gaps) / heights.reduce((a, b) => a + b, 0)) : 1
    start = 0
    const rows = breaks.map((end, row) => {
      const rowSize = heights[row] * scale
      const photos = []
      for (let index = start; index < end; index++) photos.push({ index, width: ratios[index] * rowSize })
      start = end
      return { height: rowSize, photos }
    })
    return { rows, height: rows.reduce((sum, row) => sum + row.height, gaps), scroll: !fit }
  }

  // Large collections retain readable thumbnails and scroll instead of
  // shrinking hundreds of photographs to fit on a single screen.
  if (count > 32) {
    const targetHeight = Math.min(240, Math.max(120, height / 3))
    const breaks: number[] = []
    let start = 0
    for (let end = 1; end <= count; end++) {
      if (end === count || rowHeight(start, end) <= targetHeight) {
        breaks.push(end)
        start = end
      }
    }
    return arrange(breaks, false, targetHeight)
  }

  let best: PhotoLayout = { rows: [], height: 0, scroll: false }
  let bestArea = -1
  for (let rows = 1; rows <= count; rows++) {
    if ((rows - 1) * gap >= height) break
    const target = (height - (rows - 1) * gap) / rows
    const costs = Array.from({ length: rows + 1 }, () => Array<number>(count + 1).fill(Infinity))
    const previous = Array.from({ length: rows + 1 }, () => Array<number>(count + 1).fill(0))
    costs[0][0] = 0
    for (let row = 1; row <= rows; row++) {
      for (let end = row; end <= count; end++) {
        for (let start = row - 1; start < end; start++) {
          if (width <= (end - start - 1) * gap) continue
          const cost = costs[row - 1][start] + (rowHeight(start, end) - target) ** 2
          if (cost < costs[row][end]) {
            costs[row][end] = cost
            previous[row][end] = start
          }
        }
      }
    }
    if (!Number.isFinite(costs[rows][count])) continue
    const breaks = [count]
    let end = count
    for (let row = rows; row > 1; row--) {
      end = previous[row][end]
      breaks.unshift(end)
    }
    const layout = arrange(breaks, true)
    const area = layout.rows.reduce((sum, row) => sum + row.height * row.photos.reduce((w, photo) => w + photo.width, 0), 0)
    if (area > bestArea) {
      best = layout
      bestArea = area
    }
  }
  return best
}
