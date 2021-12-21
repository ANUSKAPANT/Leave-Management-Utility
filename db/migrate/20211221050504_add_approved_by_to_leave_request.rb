class AddApprovedByToLeaveRequest < ActiveRecord::Migration[6.0]
  def change
    add_column :leave_requests, :approver_id, :integer
  end
end
