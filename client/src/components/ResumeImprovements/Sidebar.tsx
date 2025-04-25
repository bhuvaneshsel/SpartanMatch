import type { IHighlight } from "../react-pdf-higlighter";

interface Props {
  highlights: Array<IHighlight>;
  scrollToHighlight: (highlight: IHighlight) => void;
}

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};


export function Sidebar({
  highlights,
  scrollToHighlight,
}: Props) {
  return (
    <div className="sidebar">
      <div className="sidebar-comments">
        {highlights.map((highlight, index) => (
          <div
            key={index}
            className="sidebar-comment"
            onClick={() => {
              updateHash(highlight);
            }}
          >
            <div className="comment-number">
              <p>{index+1}</p>
            </div>
            <div className="comment-description">
              <p>{highlight.comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
