import type { Feature, FeatureCollection, Point } from 'geojson'

export interface Photo {
  iiifId: string
  dimensions: [number, number]
}

export type LocationFeature = Feature<Point, { photos: Photo[] }> & { id: number }
export interface Locations extends FeatureCollection<Point, { photos: Photo[] }> {
  features: LocationFeature[]
}

export interface ExhibitionMessage {
  active?: boolean
  data?: number[] | null
}
