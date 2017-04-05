import time, threading, traceback, sys
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
 
threadLock = threading.Lock()
 
def run(url, query):
  try:
    driver = webdriver.Remote(url, webdriver.DesiredCapabilities.FIREFOX)
    driver.implicitly_wait(30)
    driver.get("http://www.google.com")
    q = driver.find_element_by_name("q")
    q.send_keys(query)
    q.send_keys(Keys.RETURN)
    resultsDiv = driver.find_element_by_id("resultStats")
    numResults = resultsDiv.text
    driver.close()
 
    threadLock.acquire()
    print "Test complete, number of Google results: %s" % numResults
    threadLock.release()
  except Exception, e:
    threadLock.acquire()
    print "Unexpected error encountered while running test."
    traceback.print_exc(file=sys.stdout)
    threadLock.release()
 
def main(): 
  maxRequestsPerHost = 1
  hosts = [ "ec2-34-205-75-185.compute-1.amazonaws.com"]
  queries = [ "Selenium", "Protegra", "Winnipeg", "Canada" ]
 
  if len(hosts) == 0:
    return
 
  reqs = []
  for idx, host in enumerate(hosts):
    first = idx*maxRequestsPerHost
    last = idx*maxRequestsPerHost+maxRequestsPerHost
    for query in queries[first:last]:
      url = str.format("http://{0}/wd/hub", host)
      reqs.append([url, query])
 
  print "Sending %s Requests" % len(reqs)
 
  threads = []
  for req in reqs:
    thread = threading.Thread(target=run, args=[req[0], req[1]])
    thread.start()
    threads.append(thread)
 
  for t in threads:
    t.join()
 
  print "All requests completed processing."
 
if __name__== "__main__":
    main()