    import { ref } from 'vue'
    var source = ref(null)
    var dest =  ref(null)
    
    export  function getLineSegments(polyline) {
        const sourcePoint = 0;
        const destinationPoint = 1;
        const other = 2;
       
        var slat = polyline.getPath().getAt(sourcePoint).lat()
          var slng = polyline.getPath().getAt(sourcePoint).lng()
          var dlat = polyline.getPath().getAt(destinationPoint).lat()
          var dlng = polyline.getPath().getAt(destinationPoint).lng()
          var points = {source: {lat: slat,lng: slng},destination: {lat: dlat,lng: dlng}}


          source.value = points.source
          dest.value =  points.destination
          console.log(points)
          
          var dlist = convertToRadians(points)
          var x = dlist[sourcePoint]
          var y = dlist[destinationPoint]
          var z = dlist[other]
          console.log("x,y,z-->", x,y,z)
          
          var centrePoint =  getHalfSegment(x,y,z);
          console.log("centrepoint",centrePoint)


          // now get the quarter points
          var quarters = {
            quarterOne: {
                source: {
                    lat: slat,
                    lng: slng
                },
                destination: {
                    lat: centrePoint.lat,
                    lng: centrePoint.lng
                }
            },
            quarterTwo: {
                source: {
                    lat: dlat,
                    lng: dlng
                },
                destination: {
                    lat: centrePoint.lat,
                    lng: centrePoint.lng
                }
            }
          }
        
          var quartersList = [];
          for (var p in quarters) {
            dlist =  convertToRadians(quarters[p])
            x = dlist[sourcePoint]
            y = dlist[destinationPoint]
            z = dlist[other]
            var quarterPoint =  getHalfSegment(x,y,z)
            quartersList.push(quarterPoint)
          }
          console.log("quartersList", quartersList)
        



          // now get the eighth points
          var octs = {
            eightOne: { //between starting point and quarter one
                source: {
                    lat: slat,
                    lng: slng
                },
                destination: {
                    lat: quartersList[0].lat,
                    lng: quartersList[0].lng
                }
            },
            eightTwo: { //between quarter1 and centre point
                source: {
                    lat: quartersList[0].lat,
                    lng: quartersList[0].lng
                },
                destination: {
                    lat: centrePoint.lat,
                    lng: centrePoint.lng
                }
            },
            eightThree: {
                source: {
                    lat: centrePoint.lat,
                    lng: centrePoint.lng
                },
                destination: {
                    lat: quartersList[1].lat,
                    lng: quartersList[1].lng
                }
            },
            eightFour: {
                source: {
                    lat: quartersList[1].lat,
                    lng: quartersList[1].lng
                },
                destination: {
                    lat: dlat,
                    lng: dlng
                }
            }
          }

          var octoList = [];
          for (p in octs) {
            dlist =  convertToRadians(octs[p])
            x = dlist[sourcePoint]
            y = dlist[destinationPoint]
            z = dlist[other]
            var octoPoint =  getHalfSegment(x,y,z)
            octoList.push(octoPoint)
          }
          console.log("octoList", octoList)

          const allSegmentsList = [{lat:slat, lng:slng}, octoList[0], quartersList[0], octoList[1], centrePoint, octoList[2], quartersList[1], octoList[3], {lat:dlat, lng:dlng}];
          console.log(allSegmentsList)

          return allSegmentsList 
          
        }

function convertToRadians(points) {
    var x = 0;
    var y = 0;
    var z = 0;
    for (var loc in points) {
      var latitude = points[loc].lat * Math.PI / 180; //convert to radians?
      var longitude = points[loc].lng * Math.PI / 180;
            
     latitude = parseFloat(latitude)
     longitude = parseFloat(longitude)

     x = x + parseFloat(Math.cos(latitude)) * parseFloat(Math.cos(longitude));
     y += Math.cos(latitude) * Math.sin(longitude);
     z += Math.sin(latitude);
     console.log("xyz",x,y,z)
    }
    return [x,y,z]
}



function getHalfSegment(x,y,z) {
    var xval = x / 2;
    var yval = y / 2;
    var zval = z / 2;
    console.log("xval",xval)
  
    var centralLongitude = Math.atan2(yval, xval);
    var centralSquareRoot = Math.sqrt(xval * xval + yval * yval);
    var centralLatitude = Math.atan2(zval, centralSquareRoot);
  
    var centrelat = centralLatitude * 180 / Math.PI
    var centrelng =  centralLongitude * 180 / Math.PI
    
     //getQuarterSegment(points.source, points.destination, centrelat, centrelng)
    return {lat: centrelat, lng: centrelng}
}
