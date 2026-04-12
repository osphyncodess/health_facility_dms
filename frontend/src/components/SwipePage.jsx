import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";

export default function SwipePage() {
  const navigate = useNavigate();

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      navigate("/next"); // forward
    },
    onSwipedRight: () => {
      navigate(-1); // back
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true // also works on desktop
  });

  return (
    <div {...handlers} style={{ height: "100vh" }}>
      <h1>Swipe Left or Right</h1>
    </div>
  );
}