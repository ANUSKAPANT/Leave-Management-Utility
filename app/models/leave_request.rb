class LeaveRequest < ApplicationRecord
  belongs_to :user
  enum status: { pending: 0, approved: 1, rejected: 2 }
  enum leave_type: { sick_leave: 0, personal: 1, others: 2 }

  validates_presence_of :title
  validates_presence_of :start, :end_date
  validates_presence_of :leave_type, message: "Leave Type can't be blank"
  # validate same user can't create leave for same day with multiple reasons
  validate :prevent_multiple_leave_on_same_day

  scope :upcoming_leaves,  -> { where('start > ?', Date.today) }

  private

  def prevent_multiple_leave_on_same_day
    (user.upcoming_leaves - [self]).each do |leave|
      if overlaps?(leave)
         return self.errors.add :message, "Leave already exists for given day/s"
      end
    end
  end

  # Check if a given interval overlaps this interval    
  def overlaps?(other)
    start <= other.end_date && other.start <= self.end_date
  end
end
