export interface Course {
    id?: number;
    title: string;
    description: string;
    instructor_id: number; // Foreign key from users table
    price?: number; // Optional (for free or paid courses)
    created_at?: Date;
  }
  