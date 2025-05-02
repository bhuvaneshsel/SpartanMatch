export function Sidebar({ improvements }) {
  return (
    <div className="sidebar">
      <div className="sidebar-comments">
        {improvements.map((improvement, index) => (
        <div key={index} className="sidebar-comment">
          <div className="comment-number">
            <p>{index+1}</p>
          </div>
          <div className="comment-description">
            <strong>{improvement.category}</strong>
            <p className="comment-suggestion">{improvement.suggestion}</p>
            {improvement.referenceText && (<p className="comment-reference-text">In reference to "{improvement.referenceText}"</p>)}
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}
