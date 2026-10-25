import time
import threading
import msvcrt
from datetime import date, timedelta

today = date.today()
week_start = today - timedelta(days=6)
count=0
total_minutes=0
weekly_seconds=0

subject_totals = {}
daily_totals = {}

try:
    with open("study_history.txt", "r") as file:
        history = file.read()

except FileNotFoundError:
    history = ""
sessions = history.splitlines()



for item in sessions:
    parts = item.split(",")

    if len(parts) == 3:
        session_date = date.fromisoformat(parts[0])
        studied_subject = parts[1]
        studied_seconds = int(parts[2])

        # Weekly study tracking
        if week_start <= session_date <= today:
            weekly_seconds += studied_seconds

            if session_date not in daily_totals:
                daily_totals[session_date] = 0

            daily_totals[session_date] += studied_seconds

        # Today's study tracking
        if session_date == today:
            total_minutes += studied_seconds / 60

            if studied_subject not in subject_totals:
                subject_totals[studied_subject] = 0

            subject_totals[studied_subject] += studied_seconds

pause_event=threading.Event()
stop_event = threading.Event()

session_result = {"studied_seconds": 0}

def countdown():
    seconds_remaining = session_seconds
    
    while seconds_remaining > 0:
    
       if stop_event.is_set():
         print("Study session stopped early!")
         break
       if pause_event.is_set():
         time.sleep(0.1)
         continue

      
       time.sleep(1)
       if stop_event.is_set():
          break
       if pause_event.is_set():
          continue
       seconds_remaining -= 1

       remain_min = seconds_remaining // 60
       remain_sec = seconds_remaining % 60

      
       
       print(f"Time remaining: {remain_min}:{remain_sec:02d}")
    studied_seconds = session_seconds - seconds_remaining
    session_result["studied_seconds"] = studied_seconds

    if not stop_event.is_set():
         print("Study session completed!")


while True:
    
    subject = input("What are you studying? ").strip().lower()
    while True:
        try:
           session_minute = int(input("How many minutes do you want to study? "))

           if session_minute <= 0:
            print("Please enter a number greater than 0.")
            continue

           break

        except ValueError:
                print("Enter a valid number.")
    session_seconds = session_minute * 60

    pause_event.clear()
    stop_event.clear()
    timer_thread = threading.Thread(target=countdown)
    timer_thread.start()


    while timer_thread.is_alive():
      if msvcrt.kbhit():
        command = msvcrt.getch().decode().lower()
      

      

        if command == "p":
         pause_event.set()
         print("\nTimer paused!")
        elif command =="r":
        
          pause_event.clear() 
          print("\nTimer resumes!")
        elif command == "s":
         stop_event.set()
         print("\nStudy session stopping...")

    timer_thread.join()
    if not stop_event.is_set():
       count += 1
    total_minutes += session_result["studied_seconds"] / 60
    weekly_seconds += session_result["studied_seconds"]
    if today not in daily_totals:
       daily_totals[today] = 0

    daily_totals[today] += session_result["studied_seconds"]
    if subject not in subject_totals:
       subject_totals[subject] = 0

    subject_totals[subject] += session_result["studied_seconds"]
    with open("study_history.txt", "a") as file:
           file.write(f"{today},{subject},{session_result['studied_seconds']}\n")
           
          
    


  
    print("Today's study summary:")
        

    for subject_name, seconds_studied in subject_totals.items():
        minutes = seconds_studied // 60
        seconds = seconds_studied % 60
        print(f"{subject_name}: {minutes} minutes {seconds} seconds")

    total_seconds = round(total_minutes * 60)
    minutes = total_seconds // 60
    seconds = total_seconds % 60

    print("-------------------------")
    print(f"Total: {minutes} minutes {seconds} seconds")
    weekly_minutes = weekly_seconds // 60
    weekly_remaining_seconds = weekly_seconds % 60

    print("-------------------------")
    print("Last 7 Days Study Summary:")
   
     

    
    for i in range(7):
        day = week_start + timedelta(days=i)
        seconds_studied = daily_totals.get(day, 0)

        minutes = seconds_studied // 60
        seconds = seconds_studied % 60

        print(f"{day}: {minutes} minutes {seconds} seconds")

    print("-------------------------")
    print(f"Total: {weekly_minutes} minutes {weekly_remaining_seconds} seconds")
    decision = input("Do you want another study session? (yes/no): ")
    if decision.lower() == "no":
        break
   