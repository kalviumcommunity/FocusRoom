import { Plus, Users } from "lucide-react";

function JoinRoom({
  errorMsg,
  clearError,
  setShowCreateModal,
  showCreateModal,
  showJoinModal,
  setShowJoinModal,
  joinCode,
  setJoinCode,
  loading,
  handleJoinTeam,
  teamName,
  setTeamName,
  handleCreateTeam,
}) {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="flex items-center justify-center mb-4">
            <Users className="w-12 h-12 text-red-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Focus Teams</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Stay focused together with your team
          </p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="max-w-md mx-auto mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <p className="text-red-700">{errorMsg}</p>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700 font-bold text-lg"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Create Team Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Create Team
              </h2>
              <p className="text-gray-600 mb-6">
                Start a new focus team and invite others to join your
                productivity journey
              </p>
              <button
                onClick={() => {
                  setShowCreateModal(true);
                  clearError();
                }}
                className="w-full bg-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Create New Team
              </button>
            </div>
          </div>

          {/* Join Team Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Join Team
              </h2>
              <p className="text-gray-600 mb-6">
                Enter a team code to join an existing focus team and collaborate
              </p>
              <button
                onClick={() => {
                  setShowJoinModal(true);
                  clearError();
                }}
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                Join Existing Team
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Create New Team
            </h3>
            <input
              type="text"
              placeholder="Enter team name"
              value={teamName}
              onChange={(e) => {
                setTeamName(e.target.value);
                clearError();
              }}
              className="w-full p-4 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-red-500"
              maxLength={50}
            />
            {errorMsg && (
              <div className="mb-4 text-red-600 text-sm text-center">
                {errorMsg}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setTeamName("");
                  clearError();
                }}
                disabled={loading}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTeam}
                disabled={!teamName.trim() || loading}
                className="flex-1 py-3 px-6 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Team Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Join Team</h3>
            <input
              type="text"
              placeholder="Enter team code (e.g., ABCD1234)"
              value={joinCode}
              onChange={(e) => {
                setJoinCode(e.target.value.toUpperCase());
                clearError();
              }}
              className="w-full p-4 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={8}
            />
            {errorMsg && (
              <div className="mb-4 text-red-600 text-sm text-center">
                {errorMsg}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setJoinCode("");
                  clearError();
                }}
                disabled={loading}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinTeam}
                disabled={!joinCode.trim() || loading}
                className="flex-1 py-3 px-6 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Joining...
                  </div>
                ) : (
                  "Join"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JoinRoom;
