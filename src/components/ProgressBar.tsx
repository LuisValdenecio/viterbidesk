import '../styles/progress-bar.css';

const ProgressBar: React.FC<{
  percentage: number;
}> = ({ percentage }) => {
  return (
    <div className="progress-bar">
      <div className="progress-bar__fill" style={{ width: `${percentage}%` }} />
    </div>
  );
};
export default ProgressBar;
