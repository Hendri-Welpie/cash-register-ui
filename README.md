# Cash Register UI

A React Native (Expo) mobile application for a simple cash register. Users can enter amounts via a keypad, add them to a list of charges, and view a total. The app communicates with a backend API for data persistence.

## Features

- Keypad for entering amounts (up to R999,999.99)
- Add charges to a scrollable list
- Delete individual charges
- Display total of all charges
- Amounts displayed in South African Rands with 2 decimal places

## Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- Expo CLI or EAS CLI
- Android device or emulator for testing APK

## Setup

### Backend

1. Navigate to the `cash-register-api` directory (sibling to this one).
2. Run the backend services:

   ```bash
   docker-compose up -d
   ```

   This starts PostgreSQL and the Kotlin Spring Boot API on port 8080.

### Frontend

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure the API URL:

   - For local development (simulator/emulator): The default `.env` uses `http://localhost:8080/api/v1/charges`.
   - For physical device testing: Update `.env` with your laptop's local IP:

     ```
     EXPO_PUBLIC_API_URL=http://192.168.1.100:8080/api/v1/charges
     ```

     Replace `192.168.1.100` with your actual IP (find via `ifconfig` or `ip addr`).

3. Start the development server:

   ```bash
   npx expo start
   ```

   Open in Expo Go, emulator, or simulator.

## Building APK for Mobile Testing

1. Install EAS CLI:

   ```bash
   npm install -g eas-cli
   ```

2. Log in to Expo:

   ```bash
   eas login
   ```

3. Build the APK:

   ```bash
   eas build --platform android --profile production
   ```

   (You may need to configure `eas.json` for build profiles.)

4. Download and install the APK on your Android device.

## Testing

- **Local Testing**: Use Expo Go or simulator with `localhost` API URL.
- **Mobile Device**: Ensure device and laptop are on the same Wi-Fi network. Use the IP-based URL. Install the built APK.
- **Backend Communication**: The app makes REST API calls to fetch, add, and delete charges. Ensure port 8080 is accessible (check firewall settings).

## Project Structure

- `app/`: Main app screens (using Expo Router)
- `components/`: Reusable UI components
- `constants/`: Theme and constants
- `hooks/`: Custom React hooks
- `.env`: Environment variables (API URL)

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)

## Notes

- The app uses idempotent API calls to handle network issues.
- Data is persisted in PostgreSQL via the backend.
