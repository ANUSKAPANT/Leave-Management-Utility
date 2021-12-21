class CreateReplies < ActiveRecord::Migration[6.0]
  def change
    create_table :replies do |t|
      t.integer :leave_request_id
      t.string :reason

      t.timestamps
    end
  end
end
