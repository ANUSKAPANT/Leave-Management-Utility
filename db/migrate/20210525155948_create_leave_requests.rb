class CreateLeaveRequests < ActiveRecord::Migration[6.0]
  def change
    create_table :leave_requests do |t|
      t.string :title
      t.date :start
      t.date :end
      t.integer :status

      t.timestamps
    end
  end
end
