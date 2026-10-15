import time

for i in range(2400, 10, -1):
    time.sleep(1)
    remain_min=i//60 
    remain_sec=i%60
    print(f"{remain_min}:{remain_sec:02d}")
   
  





