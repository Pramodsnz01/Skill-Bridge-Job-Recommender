# Dynamic Chart Updates Feature

## Overview
The dashboard now supports dynamic chart updates when clicking on different resumes in the recent analyses list. This allows users to compare skill gaps across different resume analyses without navigating away from the dashboard.

## Features

### 1. Clickable Recent Analyses
- Each resume in the "Recent Analyses" section is now clickable
- Visual feedback shows which analysis is currently selected
- Loading states indicate when data is being fetched

### 2. Dynamic Chart Updates
- The "Skill Gaps by Domain" chart updates automatically when a different analysis is selected
- Shows the selected resume name in the chart header
- Maintains the same chart format and styling

### 3. Visual Indicators
- Selected analysis has a blue background and white icon
- Loading spinner appears when fetching analysis data
- "Loading..." badge appears next to the status
- Reset button allows returning to the latest analysis

## How It Works

### Frontend Implementation
1. **State Management**: Added `selectedAnalysis` state to track the currently selected analysis
2. **Click Handler**: `handleAnalysisClick` function fetches analysis data by resume ID
3. **Visual Feedback**: Dynamic styling based on selection state
4. **Chart Updates**: Chart data source switches between `selectedAnalysis` and `latestAnalysis`

### Backend Integration
- Uses existing `/api/analyze/resume/:resumeId` endpoint
- Returns complete analysis data including learning gaps
- Maintains authentication and authorization

## User Experience

### Selecting an Analysis
1. Click on any resume in the "Recent Analyses" list
2. The item becomes highlighted with a blue background
3. A loading spinner appears in the icon
4. The chart updates to show skill gaps for that specific resume
5. The chart header shows which resume is being displayed

### Resetting to Latest
1. Click the "(Reset)" button in the chart header
2. Returns to showing the latest analysis data
3. Removes the selection highlighting

## Technical Details

### Data Flow
1. User clicks on recent analysis item
2. Frontend extracts resume ID from the analysis data
3. API call to `/api/analyze/resume/:resumeId`
4. Backend returns analysis with learning gaps
5. Frontend updates `selectedAnalysis` state
6. Chart re-renders with new data

### Error Handling
- Shows toast notifications for API errors
- Graceful fallback to latest analysis if selection fails
- Loading states prevent multiple simultaneous requests

## Files Modified

### Frontend
- `src/pages/Dashboard.jsx`: Main dashboard component with dynamic chart logic
- `src/services/dashboardService.js`: Added `getAnalysisByResumeId` function

### Backend
- No changes required (uses existing endpoints)

## Future Enhancements
- Add comparison mode to show multiple analyses side-by-side
- Implement analysis history timeline
- Add export functionality for selected analysis
- Cache analysis data to improve performance 