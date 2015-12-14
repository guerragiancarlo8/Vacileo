class CreateGameSessions < ActiveRecord::Migration
  def change
    create_table :game_sessions do |t|
    	t.references :user, index: true
    	t.references :game, index: true
    	t.integer :score
      t.timestamps null: false
    end
  end
end
