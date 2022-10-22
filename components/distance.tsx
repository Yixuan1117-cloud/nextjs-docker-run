const secondsPerDay = 60 * 60 * 24;
const commutesPerYear = 255 * 2;

type DistanceProps = {
  leg: google.maps.DirectionsLeg;
};

export default function Distance({ leg }: DistanceProps) {
  if (!leg.distance || !leg.duration) return null;

  const days = Math.floor(
    (commutesPerYear * leg.duration.value) / secondsPerDay
  );
  const cost = Math.floor(
    255 * 2 * 1.5
  );

  return (
    <div>
      <p>
        This area is <span className="highlight">{leg.distance.text}</span> away
        from your destination. That would take{" "}
        <span className="highlight">{leg.duration.text}</span> each direction.
      </p>

      <p>
        That's <span className="highlight">{days} days</span> to take bus each
        year at a cost of{" "}
        <span className="highlight">
          ${new Intl.NumberFormat().format(cost)}
        </span>
        .
      </p>
    </div>
  );
}