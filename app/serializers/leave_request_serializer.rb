class LeaveRequestSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :title, :status, :start, :end_date
  belongs_to :user
end