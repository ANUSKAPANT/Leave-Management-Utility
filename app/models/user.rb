class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  enum role: { user: 0, admin: 1 }
  has_many :leave_requests
  validates :first_name, :last_name, presence: true

  def upcoming_leaves
    leave_requests.where("end_date > ?", Date.today)
  end
  
end
