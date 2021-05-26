class AddUserIdToLeaveRequests < ActiveRecord::Migration[6.0]
  def change
    add_column :leave_requests, :user_id, :integer
  end
end
