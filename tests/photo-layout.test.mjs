import assert from 'node:assert/strict'
import test from 'node:test'
import { photoLayout } from '../src/utils/photo-layout.ts'

function verifyLayout(ratios, width, height) {
  const layout = photoLayout(ratios, width, height)
  assert.deepEqual(layout.rows.flatMap((row) => row.photos.map((photo) => photo.index)), ratios.map((_, index) => index))
  for (const row of layout.rows) {
    assert(row.height > 0)
    assert(row.photos.reduce((sum, photo) => sum + photo.width, 0) + (row.photos.length - 1) * 8 <= width + 0.01)
    for (const photo of row.photos) {
      assert(Math.abs(photo.width / row.height - ratios[photo.index]) < 0.0001, 'preserves every original aspect ratio')
    }
  }
  if (!layout.scroll) assert(layout.height <= height + 0.01, 'fits the full selection without clipping')
  return layout
}

test('eight portraits occupy substantially more space than a single row', () => {
  const ratios = Array(8).fill(0.65)
  const layout = verifyLayout(ratios, 740, 790)
  const area = layout.rows.reduce((sum, row) => sum + row.height * row.photos.reduce((width, photo) => width + photo.width, 0), 0)
  assert(layout.rows.length > 1)
  assert(area / (740 * 790) > 0.6)
  assert(!layout.scroll)
})

test('mixed landscape and portrait photos fit a narrow pane without cropping', () => {
  verifyLayout([0.45, 1.8, 0.7, 1.3, 0.55, 2.1, 0.8, 0.6], 374, 406)
})

test('a single photo scales to the pane', () => {
  const layout = verifyLayout([0.5], 740, 790)
  assert.equal(layout.rows[0].height, 790)
  assert.equal(layout.rows[0].photos[0].width, 395)
})

test('larger selections remain readable and scroll instead of becoming tiny', () => {
  const layout = verifyLayout(Array(1133).fill(0.65), 740, 790)
  assert(layout.scroll)
  assert(layout.height > 790)
  assert(layout.rows.every((row) => row.height >= 120))
})

test('all small selections fit at desktop and mobile sizes', () => {
  for (let count = 1; count <= 32; count++) {
    const ratios = Array.from({ length: count }, (_, index) => [0.5, 0.7, 1.5, 2][index % 4])
    verifyLayout(ratios, 740, 790)
    verifyLayout(ratios, 374, 406)
  }
})

test('empty or unmeasured containers produce no rows', () => {
  assert.deepEqual(photoLayout([], 740, 790).rows, [])
  assert.deepEqual(photoLayout([0.5], 0, 0).rows, [])
})
