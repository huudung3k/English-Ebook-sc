import "./interactive-button.css"

export default function InteractiveButton({ text, onClick }) {
    return (
        <button onClick={onClick} className="btn interactive-btn">{text}</button>
    )
};
