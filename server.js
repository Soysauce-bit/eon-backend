const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize platform state
async function initializePlatform() {
  const { data, error: selectError } = await supabase
    .from('platform_state')
    .select('*')
    .single();
   
  if (selectError && selectError.code !== 'PGRST116') {
    console.error('Error selecting platform state during initialization:', selectError);
  }

  if (!data) {
    const { data: newState, error: insertError } = await supabase
      .from('platform_state')
      .insert([
        {
          version: '1.0.3',
          total_interactions: 0,
          growth_level: 0,
          last_updated: new Date().toISOString()
        }
      ])
      .select()
      .single();
     
    if (insertError) {
      console.error('Error inserting initial platform state:', insertError);
    } else {
      console.log('Platform state initialized:', newState);
    }
  }
}

// API Endpoints

// POST /api/interactions
app.post('/api/interactions', async (req, res) => {
  try {
    const { type, coordinates, sessionId, timestamp } = req.body;
    
    console.log('Recording interaction:', { type, sessionId });
    
    // 1. Record interaction first
    const { data: interaction, error: interactionError } = await supabase
      .from('user_interactions')
      .insert([
        {
          interaction_type: type,
          x_coordinate: coordinates.x,
          y_coordinate: coordinates.y,
          session_id: sessionId,
          created_at: timestamp || new Date().toISOString()
        }
      ])
      .select();

    if (interactionError) throw interactionError;

    // 2. Count ALL interactions from the database 
    const { count: totalInteractions, error: countError } = await supabase
      .from('user_interactions')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    // 3. Calculate growth level 
    const growthLevel = Math.min(100, Math.floor(Math.sqrt(totalInteractions) * 3));

    console.log('📊 Growth calculation:', {
      totalInteractions,
      growthLevel,
      progress: `${Math.floor((totalInteractions / 1111) * 100)}% to next level` // 1111 interactions for 100% 
    });

    // 4. DEBUG: Check current platform_state before update 
    const { data: currentState, error: readError } = await supabase
      .from('platform_state')
      .select('*')
      .eq('id', 1)
      .single();

    if (readError) {
      console.error('❌ Error reading platform_state:', readError);
    } else {
      console.log('📝 Current platform_state:', currentState);
    }

    // 5. Update platform state with detailed logging 
    console.log('🔄 Attempting to update platform_state with:', {
      total_interactions: totalInteractions,
      growth_level: growthLevel
    });

    const { data: updateResult, error: updateError } = await supabase
      .from('platform_state')
      .update({
        total_interactions: totalInteractions,
        growth_level: growthLevel,
        last_updated: new Date().toISOString()
      })
      .eq('id', 1)
      .select();

    if (updateError) {
      console.error('❌ UPDATE ERROR:', updateError);
      throw updateError;
    }

    console.log('✅ Update result:', updateResult);

    // 6. Verify the update worked 
    const { data: verifiedState, error: verifyError } = await supabase
      .from('platform_state')
      .select('*')
      .eq('id', 1)
      .single();

    if (verifyError) {
      console.error('❌ Verification error:', verifyError);
    } else {
      console.log('🎉 Verified platform_state after update:', verifiedState);
    }

    res.json({
      success: true,
      interactionId: interaction[0].id,
      growthLevel: growthLevel,
      totalInteractions: totalInteractions
    });

  } catch (error) {
    console.error('Error recording interaction:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/platform/state
app.get('/api/platform/state', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('platform_state')
      .select('*')
      .single();

    if (error) throw error;

    res.json({
      version: data.version,
      totalInteractions: data.total_interactions,
      growthLevel: data.growth_level,
      lastUpdated: data.last_updated,
      activeExperiments: ['cosmic-data', 'neural-canvas', 'quantum-narrative']
    });

  } catch (error) {
    console.error('Error fetching platform state:', error);
    res.status(500).json({ error: 'Failed to fetch platform state' });
  }
});

// GET /api/platform/changelog
app.get('/api/platform/changelog', async (req, res) => {
  try {
    const changelog = [
      {
        id: '1',
        message: 'Platform initialized – v1.0.0',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        triggeredBy: 'system'
      },
      {
        id: '2', 
        message: 'Interactive canvas system activated',
        timestamp: new Date(Date.now() - 43200000).toISOString(),
        triggeredBy: 'system'
      },
      {
        id: '3',
        message: 'Growth tracking mechanism implemented',
        timestamp: new Date().toISOString(),
        triggeredBy: 'system'
      }
    ];

    res.json({ changelog });

  } catch (error) {
    console.error('Error fetching changelog:', error);
    res.status(500).json({ error: 'Failed to fetch changelog' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize and start server
initializePlatform().then(() => {
  app.listen(PORT, () => {
    console.log(`EON Living Platform API running on port ${PORT}`);
  });
});