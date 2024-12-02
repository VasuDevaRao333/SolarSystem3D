// Set up the canvas and context
const canvas = document.getElementById('solarSystemCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Sun properties
const sun = {
    radius: 100,
    color: 'yellow',
    x: canvas.width / 2,
    y: canvas.height / 2,
};

// Planet properties (position, radius, color, speed, name)
const planets = [
    { radius: 10, color: 'gray', distance: 150, speed: 0.01, angle: 0, name: 'Mercury', moons: [] },
    { radius: 15, color: 'blue', distance: 200, speed: 0.008, angle: 0, name: 'Earth', moons: [{ radius: 5, color: 'gray', distance: 30, speed: 0.02, angle: 0 }] },
    { radius: 25, color: 'red', distance: 300, speed: 0.005, angle: 0, name: 'Mars', moons: [{ radius: 6, color: 'gray', distance: 50, speed: 0.02, angle: 0 }] },
    { radius: 18, color: 'green', distance: 400, speed: 0.003, angle: 0, name: 'Venus', moons: [] },
];

// Star field (randomly generated stars)
const stars = [];
const numStars = 500; // Number of stars to generate

// Generate random stars
for (let i = 0; i < numStars; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2, // Random star size
    });
}

// Zoom factor for interactive zooming
let zoomFactor = 1;

// Add zoom functionality
canvas.addEventListener('wheel', (event) => {
    if (event.deltaY > 0) {
        zoomFactor *= 0.95;
    } else {
        zoomFactor *= 1.05;
    }
    zoomFactor = Math.min(Math.max(zoomFactor, 0.5), 3); // Clamp zoom factor
});

// Function to draw the sun with a glowing effect
function drawSun() {
    const gradient = ctx.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, sun.radius);
    gradient.addColorStop(0, 'rgba(255, 255, 0, 1)');
    gradient.addColorStop(1, 'rgba(255, 255, 0, 0.1)');

    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
}

// Function to draw a moon
function drawMoon(planet, moon) {
    const moonX = planet.x + moon.distance * Math.cos(moon.angle);
    const moonY = planet.y + moon.distance * Math.sin(moon.angle);

    ctx.beginPath();
    ctx.arc(moonX, moonY, moon.radius, 0, Math.PI * 2);
    ctx.fillStyle = moon.color;
    ctx.fill();
    ctx.closePath();
}

// Function to draw a planet with a gradient effect
function drawPlanet(planet) {
    const x = sun.x + planet.distance * Math.cos(planet.angle);
    const y = sun.y + planet.distance * Math.sin(planet.angle);

    // Planet day-night cycle (lighting effect)
    const lightSide = (planet.angle % (Math.PI * 2) < Math.PI) ? '#fff' : '#333';  // Simplified lighting

    ctx.beginPath();
    ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
    ctx.fillStyle = lightSide;
    ctx.fill();
    ctx.closePath();

    // Draw planet name
    ctx.font = '14px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(planet.name, x + 12, y); // Offset text to avoid overlap with the planet

    // Draw moons
    planet.moons.forEach(moon => drawMoon({ x, y }, moon));
}

// Function to update the planets' positions (orbit movement)
function updatePlanets() {
    planets.forEach(planet => {
        planet.angle += planet.speed; // Update the angle to simulate orbit
    });
}

// Function to draw the stars in the background with fading effect
function drawStars() {
    stars.forEach(star => {
        const starSize = star.size + Math.sin(Date.now() / 1000 + star.x * 0.001) * 0.5;
        ctx.beginPath();
        ctx.arc(star.x, star.y, Math.max(starSize, 0), 0, Math.PI * 2);  // Avoid negative radius
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    });
}

// Function to draw orbit trails
function drawOrbitTrail(planet) {
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, planet.distance, 0, Math.PI * 2);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
}

// Function to animate the scene
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.save();
    ctx.scale(zoomFactor, zoomFactor); // Apply zoom scale to the canvas

    drawStars(); // Draw the stars in the background
    drawSun(); // Draw the sun with glow effect
    planets.forEach(planet => {
        drawOrbitTrail(planet); // Draw orbit trails
        drawPlanet(planet); // Draw each planet
    });

    updatePlanets(); // Update planet positions

    ctx.restore(); // Restore canvas to original scale

    requestAnimationFrame(animate); // Keep animating
}

// Control planet speed via slider
const speedSlider = document.getElementById('speedSlider');
speedSlider.addEventListener('input', () => {
    const speed = parseFloat(speedSlider.value);
    planets.forEach(planet => planet.speed = speed);
});

animate();