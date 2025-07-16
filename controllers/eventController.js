export async function getEventDetails(req,res) {
    try{
        const {id}=req.params;
        const event =await pool.query('SELECT * FROM events WHERE id = $1'[id]);
        if(event.row.legth===0){
            return res.status(404).json({message:'Event not fount'})
        }
      res.json(event.row[0]);

    }catch(err){
        res.status(500).json({error:'could not fectch event details'});

    }
     
}

export async function joinEvent(req,res) {
    const {id:eventId}= req.params;
    const userId=req.user.id;

    try{
        const exists=await pool.query('SELECT * FROM  event_attendees WHERE user_id =$1 AND event_id =$2',[userId.eventId]);
        if(exists.rows.lenght>0){
return res.status(400).json({message:'Already registerd'})
        }
        await pool.query(
            'INTER INTO event_attendees(user_id,event_id) VALUES ($1,$2)',[userId,eventId]);
             res.json({ message: 'Registered successfully' });
              await client.query('COMMIT');
  res.json({ message: 'Registered successfully' });
    }
    catch(err){
await client.query('ROLLBACK');
  res.status(400).json({ error: err.message });
    }
    finally {
  client.release();
}
}


export async function cancelRegistration(req,res) {
    const{id:eventId}=req.params;
    const userId =req.user.id;
    try {
        const result = await pool.query(
             'DELETE FROM event_attendees WHERE user_id = $1 AND event_id = $2 RETURNING *', [userId, eventId]
        );
        if (result.rowCount === 0) {
      return res.status(400).json({ message: 'Not registered for this event' });
    }
    res.json({ message: 'Registration cancelled' });
        
    } catch (err) {
        res.status(500).json({error:'colud not cancle registration'})
        
    }
}

export async function listUpcomingEvents(req,res) {
    try {
        const result=await pool.query(
            `SELECT * FROM events WHERE start_time > NOW() ORDER BY start_time ASC`
        )
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch upcoming events' });
        
    }
    
}



 export async function getEventStats  (req, res) {
  const { id: eventId } = req.params;
  try {
    const stats = await pool.query(
      `SELECT 
        e.title, 
        COUNT(a.user_id) AS attendees_count
      FROM events e
      LEFT JOIN event_attendees a ON e.id = a.event_id
      WHERE e.id = $1
      GROUP BY e.id`,
      [eventId]
    );
    if (stats.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(stats.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch stats' });
  }
};


