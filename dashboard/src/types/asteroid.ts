export interface Asteroid {
  id: string;
  nasa_neo_reference_id: string;
  name: string;
  estimated_diameter_max_meters: number | null;
  is_potentially_hazardous: boolean;
  close_approach_date: string | null;
  relative_velocity_km_h: number | null;
  miss_distance_km: number | null;
  ai_threat_report: string | null;
  created_at: string;
}
