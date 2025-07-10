# SkillBridge Logo & Branding Assets

## Overview
This directory contains the official logo and branding assets for the SkillBridge platform.

## Files

### `favicon.svg`
- **Format**: SVG (Scalable Vector Graphics)
- **Size**: 32x32px viewBox
- **Design**: Bridge symbol with skill nodes
- **Colors**: 
  - Primary: #2563eb (Professional Blue)
  - Secondary: #1e40af (Dark Blue)
  - Accent: White
- **Usage**: Browser favicon, app icons

### `favicon.ico` (Placeholder)
- **Note**: This is a placeholder file
- **Production**: Convert SVG to ICO format using:
  - Online tools: favicon.io, realfavicongenerator.net
  - Command line: ImageMagick, Pillow (Python)
  - Design tools: Figma, Adobe Illustrator

## Logo Design Concept

### "Bridge to Success"
The logo represents the core mission of SkillBridge:
- **Bridge Structure**: Connecting skills to opportunities
- **Skill Nodes**: Dots representing individual skills
- **Connection Lines**: Pathways between skills and career growth
- **Circular Background**: Unity and completeness

### Color Palette
- **Primary Blue**: #2563eb (Trust, Professionalism)
- **Dark Blue**: #1e40af (Depth, Stability)
- **Success Green**: #10b981 (Growth, Achievement)
- **Energy Orange**: #f59e0b (Innovation, Creativity)

## Usage Guidelines

### Logo Component
The logo is implemented as a React component (`src/components/Logo.jsx`) with:
- Multiple sizes: sm, md, lg, xl
- Optional text display
- Dark mode support
- Consistent styling

### Implementation
```jsx
import Logo from './components/Logo';

// Different sizes
<Logo size="sm" />
<Logo size="md" />
<Logo size="lg" />
<Logo size="xl" />

// Icon only
<Logo size="lg" showText={false} />
```

## Brand Guidelines

### Typography
- **Primary Font**: Inter, Poppins, or Roboto
- **Weight**: Bold for logo text
- **Style**: Clean, modern sans-serif

### Spacing
- Maintain consistent spacing around the logo
- Minimum clear space: 1x logo height
- Responsive scaling for different screen sizes

### Background Usage
- **Light Backgrounds**: Use default blue colors
- **Dark Backgrounds**: Automatically adapts with dark mode
- **Contrast**: Ensure sufficient contrast for accessibility

## File Formats Needed

### For Production
1. **SVG**: Primary format (scalable)
2. **PNG**: Multiple sizes (16x16, 32x32, 48x48, 64x64, 128x128, 256x256)
3. **ICO**: Windows favicon
4. **Apple Touch Icon**: 180x180px for iOS devices

### For Print/Media
1. **EPS**: Vector format for print
2. **PDF**: High-quality print format
3. **JPG**: Web usage (when SVG not supported)

## Development Notes

### Current Implementation
- ✅ SVG favicon created
- ✅ Logo component implemented
- ✅ Navbar integration complete
- ✅ Footer integration complete
- ✅ Loading screen with logo
- ⏳ ICO conversion needed
- ⏳ Multiple PNG sizes needed
- ⏳ Apple touch icon needed

### Next Steps
1. Convert SVG to ICO format
2. Generate multiple PNG sizes
3. Create Apple touch icon
4. Add logo to email templates
5. Create social media assets
6. Design business cards and print materials

## Contact
For logo modifications or brand guidelines, contact the development team. 