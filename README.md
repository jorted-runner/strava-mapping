# Overview

This project is a **Strava activity mapping tool** that integrates with the **Strava API** to visualize running, cycling, and other activity data on a Google Map. The purpose of this project is to enhance data visualization for athletes by allowing them to **view their recent activities, starred segments, and time-based activity history** in an interactive way.

The software fetches **Strava activity data** using an authenticated API request and displays it on a Google Map. Each activity or segment is represented by a **polyline**, and clicking on it reveals **detailed statistics** such as distance, elevation gain, and time.

## **How to Use**

1. **Login with Strava** – Click the login button to authenticate with Strava.
2. **Select an Option** – Choose whether to view the **last 20 activities, starred segments, or activities for a specific date range**.
3. **View on Map** – Activities will be plotted as polylines with color-coded paths.
4. **Click for Details** – Click on a polyline to see an **info window with key metrics**.

The data source for this project is the **Strava API**, which provides detailed activity data based on the user's account.

[Software Demo Video](https://youtu.be/45GKkBkBHK0)

---

## Development Environment

### **Tools Used**

- **Node.js** – Backend server using **Express.js**
- **Google Maps API** – Renders interactive map and polyline routes
- **Strava API** – Fetches user activity data
- **EJS** – For rendering dynamic HTML views
- **Axios** – Handles API requests
- **JavaScript (Client-side)** – Displays Strava data on the map

### **Programming Languages & Libraries**

- **Backend**: JavaScript (Node.js, Express)
- **Frontend**: JavaScript, HTML, CSS, EJS
- **APIs Used**:
  - **Google Maps API** (for map rendering & polyline decoding)
  - **Strava API** (for fetching activity data)
- **Other Libraries**:
  - `axios` – For making HTTP requests to Strava
  - `dotenv` – For managing environment variables

---

## Useful Websites

- [Strava API Documentation](https://developers.strava.com/docs/)
- [Google Maps API Documentation](https://developers.google.com/maps/documentation/javascript/tutorial)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Guide](https://expressjs.com/)

---

## Future Work

- **Improve UI/UX** – Enhance the front-end with a better layout and responsive design.
- **Authentication Improvements** – Store Strava tokens securely for persistent logins.
- **Additional Data Metrics** – Display more insights such as elevation profiles and speed analysis.
- **Performance Optimization** – Reduce API calls and cache frequently used data.
- **Mobile Compatibility** – Ensure better display and usability on mobile devices.
- **Deploy to the Cloud** – Host on a cloud service for easier public access.
