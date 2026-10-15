sessions = 0
total_minutes = 0

print("Choose one ")

while True:
    choice=input("Type 'stop' to end study session and 'continue' to end session.")
    if choice == "stop":
        break
    elif choice == "continue":
        sessions +=1 
        total_minutes+=40
        print("Sessions:", sessions)
        print("Total minutes:", total_minutes)

