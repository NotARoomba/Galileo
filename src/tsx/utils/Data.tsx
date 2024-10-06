import { KeplerianElement } from "./Types";

export const PlanetData: Record<string, KeplerianElement> = {
    mercury: {
        object: "Mercury",
        a: 0.38709927,
        a_dot: 0.00000037,
        e: 0.20563593,
        e_dot: 0.00001906,
        i_deg: 7.00497902,
        i_dot: -0.00594749,
        L_deg: 252.25032350,
        L_dot: 149472.67411175,
        w_deg: 77.45779628,
        w_dot: 0.16047689,
        node_deg: 48.33076593,
        node_dot: -0.12534081,
        size: 2439.7, // Radius in kilometers
        lineColor: "#B0B0B0", // Gray
        rotationSpeed: 0.01, // Add rotation speed (in radians per frame)
    },
    venus: {
        object: "Venus",
        a: 0.72333566,
        a_dot: 0.00000390,
        e: 0.00677672,
        e_dot: -0.00004107,
        i_deg: 3.39467605,
        i_dot: -0.00078890,
        L_deg: 181.97909950,
        L_dot: 58517.81538729,
        w_deg: 131.60246718,
        w_dot: 0.00268329,
        node_deg: 76.67984255,
        node_dot: -0.27769418,
        size: 6051.8, // Radius in kilometers
        lineColor: "#FFD700", // Gold
        rotationSpeed: 0.004, // Add rotation speed (in radians per frame)
    },
    earth: {
        object: "Earth",
        a: 1.00000261,
        a_dot: 0.00000562,
        e: 0.01671123,
        e_dot: -0.00004392,
        i_deg: -0.00001531,
        i_dot: -0.01294668,
        L_deg: 100.46457166,
        L_dot: 35999.37244981,
        w_deg: 102.93768193,
        w_dot: 0.32327364,
        node_deg: 0.0,
        node_dot: 0.0,
        size: 6371, // Radius in kilometers
        lineColor: "#0000FF", // Blue
        rotationSpeed: 0.00007272205, // Add rotation speed (in radians per frame)
    },
    mars: {
        object: "Mars",
        a: 1.52371034,
        a_dot: 0.00001847,
        e: 0.09339410,
        e_dot: 0.00007882,
        i_deg: 1.84969142,
        i_dot: -0.00813131,
        L_deg: -4.55343205,
        L_dot: 19140.30268499,
        w_deg: -23.94362959,
        w_dot: 0.44441088,
        node_deg: 49.55953891,
        node_dot: -0.29257343,
        size: 3389.5, // Radius in kilometers
        lineColor: "#FF4500", // Orange Red
        rotationSpeed: 0.005, // Add rotation speed (in radians per frame)
    },
    jupiter: {
        object: "Jupiter",
        a: 5.20288700,
        a_dot: -0.00011607,
        e: 0.04838624,
        e_dot: -0.00013253,
        i_deg: 1.30439695,
        i_dot: -0.00183714,
        L_deg: 34.39644051,
        L_dot: 3034.74612775,
        w_deg: 14.72847983,
        w_dot: 0.21252668,
        node_deg: 100.47390909,
        node_dot: 0.20469106,
        size: 69911, // Radius in kilometers
        lineColor: "#FFDE00", // Bright Yellow
        rotationSpeed: 0.008, // Add rotation speed (in radians per frame)
    },
    saturn: {
        object: "Saturn",
        a: 9.53667594,
        a_dot: -0.00125060,
        e: 0.05386179,
        e_dot: -0.00050991,
        i_deg: 2.48599187,
        i_dot: 0.00193609,
        L_deg: 49.95424423,
        L_dot: 1222.49362201,
        w_deg: 92.59887831,
        w_dot: -0.41897216,
        node_deg: 113.66242448,
        node_dot: -0.28867794,
        size: 58232, // Radius in kilometers
        lineColor: "#DAA520", // Golden Rod
        rotationSpeed: 0.006, // Add rotation speed (in radians per frame)
    },
    uranus: {
        object: "Uranus",
        a: 19.18916464,
        a_dot: -0.00196176,
        e: 0.04725744,
        e_dot: -0.00004397,
        i_deg: 0.77263783,
        i_dot: -0.00242939,
        L_deg: 313.23810451,
        L_dot: 428.48202785,
        w_deg: 170.95427630,
        w_dot: 0.40805281,
        node_deg: 74.01692503,
        node_dot: 0.04240589,
        size: 25362, // Radius in kilometers
        lineColor: "#B0E0E6", // Powder Blue
        rotationSpeed: 0.004, // Add rotation speed (in radians per frame)
    },
    neptune: {
        object: "Neptune",
        a: 30.06992276,
        a_dot: 0.00026291,
        e: 0.00859048,
        e_dot: 0.00005105,
        i_deg: 1.77004347,
        i_dot: 0.00035372,
        L_deg: -55.12002969,
        L_dot: 218.45945325,
        w_deg: 44.96476227,
        w_dot: -0.32241464,
        node_deg: 131.78422574,
        node_dot: -0.00508664,
        size: 24622, // Radius in kilometers
        lineColor: "#1E90FF", // Dodger Blue
        rotationSpeed: 0.005, // Add rotation speed (in radians per frame)
    },
};
