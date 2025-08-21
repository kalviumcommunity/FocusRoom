import { Crown, MoreVertical, User } from "lucide-react";

function MemberCard({ member, teamData, currentUser, formatTime }) {
  const getStatusColors = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "completed":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          text: "text-orange-600",
          accent: "text-orange-500",
        };
      case "break":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-600",
          accent: "text-green-500",
        };
      case "paused":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-600",
          accent: "text-yellow-500",
        };
      case "idle":
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-600",
          accent: "text-gray-500",
        };
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "completed":
        return "🧠";
      case "break":
        return "🟢";
      case "paused":
        return "🌙";
      case "idle":
      default:
        return "⏸️";
    }
  };

  const statusColors = getStatusColors(member.status);

  return (
    <div
      className={`${statusColors.bg} rounded-lg p-3 border-2 ${statusColors.border} hover:shadow-md transition-all duration-200 relative w-full max-w-sm`}
    >
      {/* Header with profile and options */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {/* Profile Picture */}
          <div className="relative">
            {member.photoURL ? (
              <img
                src={member.photoURL}
                alt={member.name}
                className="w-8 h-8 rounded-md object-cover border border-gray-300"
              />
            ) : (
              <div className="w-8 h-8 rounded-md bg-white border border-gray-300 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-400" />
              </div>
            )}
            {/* Status indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 text-[10px]">
              {getStatusIcon(member.status)}
            </div>
          </div>

          {/* Name and badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1 mb-0.5">
              <h3 className="text-gray-800 font-medium text-xs truncate">
                {member.name}
              </h3>
              {member.uid === teamData?.ownerId && (
                <Crown className="w-2.5 h-2.5 text-yellow-500 flex-shrink-0" />
              )}
              {member.uid === currentUser.uid && (
                <span className="bg-blue-500 text-white text-[9px] px-1 py-0.5 rounded font-medium flex-shrink-0">
                  YOU
                </span>
              )}
            </div>
            <p className={`text-[10px] ${statusColors.text} font-medium`}>
              {member.status || "Idle"}
            </p>
          </div>
        </div>

        {/* Options menu */}
        {teamData?.ownerId === currentUser.uid &&
          member.uid !== currentUser.uid && (
            <button className="text-gray-400 hover:text-gray-600 p-0.5">
              <MoreVertical className="w-3 h-3" />
            </button>
          )}
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-2 gap-2">
        {/* Sessions */}
        <div className="bg-white rounded-md p-2 text-center border border-gray-200">
          <div className={`${statusColors.accent} text-sm font-bold mb-0.5`}>
            {member.totalSessionsToday || 0}
          </div>
          <div className="text-gray-500 text-[10px]">Sessions</div>
        </div>

        {/* Focus Time */}
        <div className="bg-white rounded-md p-2 text-center border border-gray-200">
          <div className={`${statusColors.accent} text-sm font-bold mb-0.5`}>
            {formatTime(member.totalMinutesToday) || "00:00:00"}
          </div>
          <div className="text-gray-500 text-[10px]">Focus Time</div>
        </div>
      </div>
    </div>
  );
}

export default MemberCard;
