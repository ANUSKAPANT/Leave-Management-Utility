class LeaveRequestSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :title, :status, :start, :end
  belongs_to :user
end