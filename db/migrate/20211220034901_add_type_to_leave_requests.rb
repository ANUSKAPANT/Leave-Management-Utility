class AddTypeToLeaveRequests < ActiveRecord::Migration[6.0]
  def change
    add_column :leave_requests, :leave_type, :integer
  end
end
