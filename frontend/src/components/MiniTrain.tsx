/**
 * A true top-down (aerial/drone) view of a bullet train's nose, pointed
 * downward -- the direction of travel down the vertical timeline track.
 * This is the composition that actually matches a vertical track: no
 * front-on silhouette to misread, no rotated 3/4 angle to fight with the
 * track's own vertical line, just the aerodynamic hood shrinking to a
 * point in the direction the train is heading. Original artwork.
 */
export default function MiniTrain() {
  return (
    <svg
      viewBox="0 0 60 100"
      className="h-20 w-12 drop-shadow-lg sm:h-24 sm:w-14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="hood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="45%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      {/* aerodynamic hood, nose pointing down */}
      <path
        d="M5 5 Q5 0 15 0 L45 0 Q55 0 55 5 L52 55 Q50 75 42 85 Q35 95 30 98 Q25 95 18 85 Q10 75 8 55 Z"
        fill="url(#hood)"
        stroke="#94A3B8"
        strokeWidth="0.75"
      />

      {/* glossy highlight sweep */}
      <path d="M12 6 Q10 35 14 60" stroke="#FFFFFF" strokeWidth="3" opacity="0.55" fill="none" strokeLinecap="round" />

      {/* raked windshield/roof seen from above */}
      <path
        d="M18 42 Q18 28 30 24 Q42 28 42 42 Q42 63 34 77 Q30 83 26 77 Q18 63 18 42 Z"
        fill="url(#glass)"
      />

      {/* saffron edge accent, following the taper */}
      <path
        d="M50 7 Q52 30 46 54 Q42 71 34 83"
        stroke="#F97316"
        strokeWidth="2.25"
        opacity="0.85"
        fill="none"
        strokeLinecap="round"
      />

      {/* side sensor/light accents, gently pulsing */}
      <rect className="svg-headlight" x="14" y="46" width="5" height="8" rx="1.5" fill="#38BDF8" opacity="0.85" />
      <rect
        className="svg-headlight"
        x="41"
        y="46"
        width="5"
        height="8"
        rx="1.5"
        fill="#38BDF8"
        opacity="0.85"
        style={{ animationDelay: "0.3s" }}
      />
    </svg>
  );
}
