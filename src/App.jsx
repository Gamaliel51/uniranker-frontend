import { useEffect, useState } from 'react'
import axios from 'axios'

function App(){

  const [criteria, setCriteria] = useState(
    ["Academic Reputation", "Campus Life", "Post graduation opportunities", "Facilities and infrastructure", 
    "Student to faculty ratio", "International students"
  ])

  const [filterAdd, setFilterAdd] = useState(["Tuition", "Living Cost", "Career Counselling", "Academic Advising", 
  "Mental Health Services", "Disability Services", "Christianity", "Islamic", "Housing Options", "Work-Study Opportunities",  
  "Availability of Scholarships"
  ])

  const [filterMain, setFilterMain] = useState({})
  const [selectedFilter, setSelectedFilter] = useState([])

  const [onOff, setOnOff] = useState(["Housing Options"])
  const [highLow, setHighLow] = useState(["Tuition", "Living Cost"])
  const [yesNo, setYesNo] = useState(["Career Counselling", "Academic Advising", "Mental Health Services", 
  "Disability Services", "Christianity", "Islamic", "Work-Study Opportunities",  "Availability of Scholarships"])

  const [selectedCriteria, setSelectedCriteria] = useState([])
  const [course, setCourse] = useState('')

  const [rankings, setRankings] = useState([])
  const [showRanking, setShowRanking] = useState(false)

  const [stateCount, setStateCount] = useState(0)

  const addCriteria = (item) => {
    if(selectedCriteria.includes(item)){
      const temp = [...selectedCriteria]
      temp.splice(temp.indexOf(item), 1)
      setSelectedCriteria(temp)
      return
    }
    setSelectedCriteria([...selectedCriteria, item])
    return
  }

  const addFilterCriteria = (item) => {
    if(selectedFilter.includes(item)){
      const temp = [...selectedFilter]
      temp.splice(temp.indexOf(item), 1)
      setSelectedFilter(temp)

      const tempF = Object.assign({}, filterMain)
      delete tempF[item]
      setFilterMain(tempF)
      return
    }
    const tempF = Object.assign({}, filterMain)
    if(onOff.includes(item)){
      tempF[item] = "on"
    }
    if(highLow.includes(item)){
      tempF[item] = "low"
    }
    if(yesNo.includes(item)){
      tempF[item] = "no"
    }
    setFilterMain(tempF)
    setSelectedFilter([...selectedFilter, item])
    return
  }

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  }

  const handleDrop = (event, dropIndex) => {
    event.preventDefault();
    const dragIndex = event.dataTransfer.getData('text');
    const newSelected = [...selectedCriteria];
    const [draggedItem] = newSelected.splice(dragIndex, 1);
    newSelected.splice(dropIndex, 0, draggedItem);
    setSelectedCriteria(newSelected);
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/ranktopsis/', {course_name: course, filter: filterMain, weighted_criteria_order: selectedCriteria})
    .then((res) => {
      if(res.data.data.length === 0){
        const temp = Object.assign([], rankings)
        temp.length = 0
        setRankings(temp)
        return
      }
      setRankings(res.data.data)
    })
  }

  const handleDataSwitch = (field, value) => {
    const tempF = Object.assign({}, filterMain)
    tempF[field] = value
    setFilterMain(tempF)
  }

  useEffect(() => {
    if(stateCount !== 0){
      setShowRanking(true)
    }
    setStateCount(stateCount + 1)
  }, [rankings])

  return(
    <div className='min-h-screen h-fit w-full bg-[#F0EBF8] relative overflow-y-auto'>
      <form onSubmit={handleSubmit} className='min-h-screen w-8/12 pb-4 mx-auto bg-white'>
        <div className='h-16 pt-2 w-full bg-[#673AB7] relative font-semibold text-3xl text-center text-white'>UniRanker</div>
        <div className='w-10/12 mx-auto'>
          <input required type="text" placeholder='Enter desired course of study' value={course} onChange={(e) => setCourse(e.target.value)} className='h-10 w-full my-10 px-4 border-solid border-2 border-black rounded-xl relative focus:border-[#673AB7]'/>
        </div>
        <div className='h-[50vh] w-full py-6 flex flex-row justify-center overflow-y-auto relative'>
          <div className='w-2/5 flex flex-col justify-evenly'>
            {filterAdd.map((item) => {
              return(
                <div onClick={() => addFilterCriteria(item)} className='w-7/12 mx-auto h-fit cursor-pointer'>
                  <input name={item} type="checkbox" checked={selectedFilter.includes(item)} />
                  <label htmlFor={item} className='px-4'>{item}</label>
                </div>
              )
            })}
          </div>
          <div className='w-3/5 pr-5'>
            <div className='w-full h-full border-solid border-2 overflow-y-auto'>
              {selectedFilter.map((sel, index) => {
                if(onOff.includes(sel)){
                  return(
                    <div key={index} className='border-solid border-2 my-4 w-11/12 mx-auto cursor-pointer'>
                      <p className='px-2'>What kind of {sel} do they offer ?</p>
                      <div className='w-full flex flex-row justify-evenly'>
                        <label>
                          <input type="radio" name={sel} checked={filterMain[sel] === "on"} onChange={() => handleDataSwitch(sel, "on")} />
                          &nbsp;&nbsp;On Campus
                        </label>
                        <label>
                          <input type="radio" name={sel} checked={filterMain[sel] === "off"} onChange={() => handleDataSwitch(sel, "off")} />
                          &nbsp;&nbsp;Off Campus
                        </label>
                        <label>
                          <input type="radio" name={sel} checked={filterMain[sel] === "both"} onChange={() => handleDataSwitch(sel, "both")} />
                          &nbsp;&nbsp;Both
                        </label>
                      </div>
                    </div>
                  )
                }
                if(highLow.includes(sel)){
                  return(
                    <div key={index} className='border-solid border-2 my-4 w-11/12 mx-auto cursor-pointer'>
                      <p className='px-2'>Price range of {sel}&nbsp;?</p>
                      <div className='w-full flex flex-row justify-evenly'>
                        <label>
                          <input type="radio" name={sel} checked={filterMain[sel] === "high"} onChange={() => handleDataSwitch(sel, "high")} />
                          &nbsp;&nbsp;High
                        </label>
                        <label>
                          <input type="radio" name={sel} checked={filterMain[sel] === "medium"} onChange={() => handleDataSwitch(sel, "medium")} />
                          &nbsp;&nbsp;Medium
                        </label>
                        <label>
                          <input type="radio" name={sel} checked={filterMain[sel] === "low"} onChange={() => handleDataSwitch(sel, "low")} />
                          &nbsp;&nbsp;Low
                        </label>
                      </div>
                    </div>
                  )
                }
                if(yesNo.includes(sel)){
                  return(
                    <div key={index} className='border-solid border-2 my-4 w-11/12 mx-auto cursor-pointer'>
                      <p className='px-2'>Should the institution offer/allow {sel}&nbsp;?</p>
                      <div className='w-full flex flex-row justify-evenly'>
                        <label>
                          <input type="radio" name={sel} checked={filterMain[sel] === "yes"} onChange={() => handleDataSwitch(sel, "yes")} />
                          &nbsp;&nbsp;Yes
                        </label>
                        <label>
                          <input type="radio" name={sel} checked={filterMain[sel] === "no"} onChange={() => handleDataSwitch(sel, "no")} />
                          &nbsp;&nbsp;No
                        </label>
                      </div>
                    </div>
                  )
                }
              })}
            </div>
          </div>
        </div>
        <hr className='mt-14'/>
        <div className='h-[40vh] w-full py-6 flex flex-row justify-center overflow-y-auto relative'>
          <div className='w-2/5 flex flex-col justify-evenly'>
            {criteria.map((item) => {
              return(
                <div onClick={(e) => addCriteria(item)} className='w-8/12 mx-auto h-fit cursor-pointer'>
                  <input name={item} type="checkbox" checked={selectedCriteria.includes(item)} />
                  <label htmlFor={item} className='px-4'>{item}</label>
                </div>
              )
            })}
          </div>
          <div className='w-3/5 pr-5'>
            <p className='px-4'>Drag to sort by priority</p>
            <div className='w-full h-full border-solid border-2 overflow-y-auto'>
              {selectedCriteria.map((sel, index) => {
                return(
                  <div key={index} draggable 
                  onDragStart={(e) => handleDragStart(e, index)} 
                  onDragOver={handleDragOver} 
                  onDrop={(e) => handleDrop(e, index)} 
                  className='border-solid border-2 my-4 p-2 w-10/12 mx-auto cursor-pointer'>
                    <p>{sel}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className='w-full flex flex-row justify-center my-8'>
          <button type='submit' className='h-12 w-2/6 relative text-white bg-[#673AB7] hover:bg-[#3c2565]'>Submit</button>
        </div>
        {showRanking && 
        <div className='min-h-screen w-full bg-gray-900 bg-opacity-20 fixed top-0 left-0 flex flex-row justify-center items-center z-20'>
          <div onClick={() => setShowRanking(false)} className='absolute top-4 right-10 cursor-pointer text-3xl text-white'>X</div>
          <div className='h-[90vh] w-10/12 px-4 overflow-y-auto absolute z-40 bg-white'>
            {rankings.map((university, index) => {
              return(
                <div key={index} className='h-fit w-full py-4 px-6 my-4 flex flex-row bg-[#673AB7] text-white'>
                  <p className='w-fit pl-2 pr-10'>{index + 1}</p>
                  <p className='px-4 border-solid border-l-2 border-white'>{university}</p>
                </div>
              )
            })}
          </div>
        </div>}
        {(showRanking && rankings.length === 0) && 
        <div className='min-h-screen w-full bg-gray-900 bg-opacity-20 fixed top-0 left-0 flex flex-row justify-center items-center z-20'>
          <div onClick={() => setShowRanking(false)} className='absolute top-4 right-10 cursor-pointer text-3xl text-white'>X</div>
          <div className='h-[90vh] w-10/12 px-4 overflow-y-auto absolute z-40 bg-white'>
            <p className='w-full py-10 text-center text-2xl'>No universities match your criteria</p>
          </div>
        </div>}
      </form>
    </div>
  )
}

export default App
