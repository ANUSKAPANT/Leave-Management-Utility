class FixLeaveRequestColumnNameEnd < ActiveRecord::Migration[6.0]
  def change
    rename_column :leave_requests, :end, :end_date
  end
end
