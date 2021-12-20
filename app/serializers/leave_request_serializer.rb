class LeaveRequestSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :title, :status, :start, :end_date, :leave_type
  belongs_to :user
end