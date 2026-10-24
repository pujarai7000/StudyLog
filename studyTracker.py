import time
import threading
import msvcrt
from datetime import date


today = date.today()
count=0
total_minutes=0




with open("study_history.txt", "r") as file:
    history = file.read()

sessions = history.splitlines()

for item in sessions:
    parts = item.split(",")

    if len(parts) == 2:
        session_date = parts[0]
        studied_seconds = int(parts[1])

        if session_date == str(today):
          total_minutes += studied_seconds / 60
sessions = history.splitlines()

session_minute = 15/ 60
session_seconds = int(session_minute * 60)

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
    with open("study_history.txt", "a") as file:
           file.write(f"{today},{session_result['studied_seconds']}\n")
          
    


    total_seconds = round(total_minutes * 60)
    minutes = total_seconds // 60
    seconds = total_seconds % 60
    print(f"Total sessions: {count}")
    print(f"Total study time: {minutes} minutes {seconds} seconds")
    decision = input("Do you want another study session? (yes/no): ")

    if decision.lower() == "no":
        break
