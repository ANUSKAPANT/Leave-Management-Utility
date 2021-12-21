class Reply < ApplicationRecord
    belongs_to :leave_requests

    validates_presence_of :reason
end
