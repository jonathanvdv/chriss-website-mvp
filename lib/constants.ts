/** Default bounding box covering the KW/GTA service area */
export const SERVICE_AREA_BBOX = {
    west: -81.0,
    south: 43.0,
    east: -79.5,
    north: 44.0,
} as const

export const SERVICE_AREA_BBOX_STRING = `${SERVICE_AREA_BBOX.west},${SERVICE_AREA_BBOX.south},${SERVICE_AREA_BBOX.east},${SERVICE_AREA_BBOX.north}`
