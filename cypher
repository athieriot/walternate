START me = node:movie("id:titanic")
MATCH (me)<-[:beIn]-(person)-[:beIn]->(movie)
RETURN movie, person
