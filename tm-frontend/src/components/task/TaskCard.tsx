function TaskCard({title, duedate, description, status}: any) {
  return (
    <div
      className={`project bg-white grid grid-cols-2 w-full rounded p-4 justify-between cursor-pointer
          ${status === 'Todo' ? 'border-4 border-red-400': ''}
          ${status === 'In-progress' ? 'border-4 border-yellow-300': ''}
          ${status === 'Completed' ? 'border-4 border-green-300': ''}
        `}
    >
      <p className="title">{title}</p>
      <div className="duedate body2 flex items-center justify-end gap-1">
        {duedate}
      </div>
      <p className="caption col-span-2">{description}</p>
    </div>
  );
}

export default TaskCard;
