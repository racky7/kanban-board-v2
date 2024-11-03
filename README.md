
# Kanban Board
Implementation of Kanban board using ReactJs.

## Demo

https://kanban-board-x.vercel.app

## Local Setup

#### 1. Install Package Dependencies
```bash
npm install
```

#### 2. Start the Project
```bash
npm run dev
```



## Features

- Change status of Task from Card Itself
- Navigate through Task using Keyboard Arrow Keys
- Open Task in Modal (Using 'Enter' Key Press)
- Perform Actions In Modal - Change Status (Using Keyboard Shortcuts - 1, 2, 3), Add Comments


## Design Choices

### 1. Technical Stack Decisions

* **shadcn/ui**: Chosen for its accessible, customizable components that provide a modern look while maintaining high performance

* **React Context**: Used for global state management, particularly for task status and modal states

* **React Query**: Implemented for efficient server state management and data caching

* **React Hotkeys**: Integrated for comprehensive keyboard navigation and shortcuts

* **Faker**: Utilized to generate realistic mock data for development and testing

### 2. Performance-First Approach

React Query Features:

- Automatic background data updates

- Optimistic updates for status changes

- Efficient caching strategy


- Context Optimization: Carefully structured to prevent unnecessary re-renders

### 3. Keyboard Navigation Implementation

React Hotkeys Integration:

- Global navigation with arrow keys (↑↓)

- Task detail access with Enter
- Status change shortcuts (1,2,3)
