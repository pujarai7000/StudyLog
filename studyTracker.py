import time
import threading

count=0
total_minutes=0

session_minute = 15/ 60
session_seconds = int(session_minute * 60)
pause_event=threading.Event()
def countdown():
    seconds_remaining = session_seconds

    while seconds_remaining > 0:
      if pause_event.is_set():
         time.sleep(0.1)
         continue
      
      time.sleep(1)
      seconds_remaining -= 1

      remain_min = seconds_remaining // 60
      remain_sec = seconds_remaining % 60

      print(f"\n{remain_min}:{remain_sec:02d}")

    print("Study session completed!")

while True:
    timer_thread = threading.Thread(target=countdown)
    timer_thread.start()


    while timer_thread.is_alive():
      command = input("Enter a command(pause/resume):")

      if command == "pause":
        pause_event.set()
        print("Timer paused!")
      elif command =="resume":
        pause_event.clear() 
        print("Timer resumes!")

    timer_thread.join()

    count += 1
    total_minutes += session_minute

    print(f"Total sessions: {count}")
    print(f"Total minutes studied: {total_minutes:.2f}")
    decision = input("Do you want another study session? (yes/no): ")

    if decision.lower() == "no":
        break
