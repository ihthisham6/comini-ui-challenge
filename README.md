# Comini UI - Educational Giraffe Game

An interactive educational game designed to teach children about comparing numbers and heights using giraffe characters. The game features multiple levels with increasing complexity and engaging animations.

## Live Demo

The application is deployed on Vercel and can be accessed at:
[https://comini-iqef1i2yt-ihthisham6s-projects.vercel.app](https://comini-iqef1i2yt-ihthisham6s-projects.vercel.app)

## Features

- Multiple game levels with progressive difficulty
- Interactive drag and drop mechanics
- Mobile and tablet responsive design
- Touch-friendly interactions for mobile devices
- Engaging animations and feedback
- Rive animations for interactive characters
- Reward system with badges

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ihthisham6/comini-ui-challenge.git
   cd comini-ui-challenge
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:5173
   ```

### Building for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

```
comini-ui/
├── public/             # Public assets
├── src/                # Source code
│   ├── assets/         # Static assets (images, Rive animations)
│   │   ├── icons/      # Game icons and characters
│   │   └── rive/       # Rive animation files
│   ├── components/     # Vue components
│   │   ├── GiraffeGameplayLevel2.vue  # Level 2 game logic
│   │   ├── GiraffeGameplayLevel3.vue  # Level 3 game logic
│   │   ├── GiraffeGameplayLevel4.vue  # Level 4 game logic
│   │   └── ...         # Other reusable components
│   ├── router/         # Vue Router configuration
│   ├── views/          # Page components
│   ├── App.vue         # Root component
│   ├── fontawesome.ts  # Font Awesome icons configuration
│   ├── main.ts         # Application entry point
│   └── style.css       # Global styles
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.js      # Vite configuration
└── vercel.json         # Vercel deployment configuration
```

## Design Approach

### Architecture

The application is built using Vue.js 3 with TypeScript, leveraging the Composition API for state management and component logic. The project uses Vite as a build tool for fast development and optimized production builds.

### Component Structure

- **View Components**: Each page in the application is a separate view component.
- **Game Components**: Each level has its own gameplay component containing the specific game logic.
- **Reusable UI Components**: Common UI elements like the OctopusIcon are implemented as reusable components.

### Mobile-First Design

The UI is designed with a mobile-first approach, with specific considerations for:
- Touch interactions for drag-and-drop on mobile devices
- Responsive layouts that adapt to different screen sizes
- Optimized performance for mobile devices

### Game Mechanics

Each level introduces new concepts:
- **Level 2**: Ordering giraffes by height with simple number comparisons
- **Level 3**: Comparing numbers and finding missing values in sequences
- **Level 4**: More complex comparisons and mathematical relationships

### Animations

The application uses a combination of:
- CSS animations for transitions and feedback
- Rive animations for character movements
- Dynamic animations based on user interactions

## Deployment

The application is deployed on Vercel with automatic deployments from the GitHub repository. The deployment configuration is specified in the `vercel.json` file, which includes:

- Proper CORS headers
- Cache control for static assets
- Redirection rules for SPA routing

## Technologies Used

- Vue.js 3
- TypeScript
- Vite
- Rive Animations
- Font Awesome
- Vue Router
- Tailwind CSS
- Vercel (Deployment)

## Browser Compatibility

The application is optimized for:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## License

This project is proprietary and not licensed for public use or redistribution without permission.
