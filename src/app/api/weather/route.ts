// app/api/weather/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'London';
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: 'City not found. Please check the spelling and try again.' },
        { status: 404 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching weather:', error);
    return NextResponse.json(
      { message: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}