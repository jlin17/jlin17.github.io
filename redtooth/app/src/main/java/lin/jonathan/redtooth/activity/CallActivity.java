package lin.jonathan.redtooth.activity;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

import lin.jonathan.redtooth.R;

public class CallActivity extends AppCompatActivity implements RecognitionListener {

    private Button accept;
    private Button end;
    private TextView timer;
    private Ringtone r;

    private String saidCarl;
    private String saidUser;

    private SpeechRecognizer mic;
    private TextToSpeech speech;
    private Intent recognizerIntent;

    private Thread main;
    private boolean loop = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        main = Thread.currentThread();
        this.requestWindowFeature(Window.FEATURE_NO_TITLE);

        Window window = getWindow();
        window.addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED | WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD);
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);

        setContentView(R.layout.activity_call);

        ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.RECORD_AUDIO}, 42);

        accept = (Button) findViewById(R.id.accept);
        end = (Button) findViewById(R.id.end);
        timer = (TextView) findViewById(R.id.timer);

        mic = SpeechRecognizer.createSpeechRecognizer(this);
        mic.setRecognitionListener(this);

        recognizerIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, "en");
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);

        saidCarl = "";
        saidUser = "";

        accept.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                accept.setVisibility(View.GONE);
                end.setVisibility(View.GONE);
                timer.setVisibility(View.VISIBLE);
                r.stop();

                mic.startListening(recognizerIntent);
                speech = new TextToSpeech(getApplicationContext(), new TextToSpeech.OnInitListener() {

                    @Override
                    public void onInit(int status) {}

                });
            }

        });

        Uri notification = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);
        r = RingtoneManager.getRingtone(getApplicationContext(), notification);
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (!r.isPlaying()) r.play();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (speech != null) speech.shutdown();
        if (mic != null) mic.destroy();
    }

    protected void threadedSpeak() {
        Thread t = new Thread() {
            public void run() {
                speak();
            }
        };

        t.start();
        try {
            t.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    protected void speak() {
        try {
            for(Voice voice : speech.getVoices()) {
                System.out.println(voice.getName());
            }

            for(Voice voice : speech.getVoices()) {
                if (voice.getName().equals("en-us-x-sfg#male_2-local")) {
                    speech.setVoice(voice);
                    System.out.println("Set the voice");
                    break;
                }
            }

            URL url = new URL("https://johan.vandegriff.net/CARL.py?user=" + saidUser + "&carl=" + saidCarl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()));

            String line;
            while((line = br.readLine()) != null) {
                saidCarl = line;
                System.out.println(saidCarl);
                speech.speak(line, TextToSpeech.QUEUE_ADD, null);
            }

            br.close();
            connection.disconnect();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onReadyForSpeech(Bundle params) {
        System.out.println("Ready to start hearing some dialogue!");
    }

    @Override
    public void onBeginningOfSpeech() {
        System.out.println("User started talking...");
    }

    @Override
    public void onRmsChanged(float rmsdB) {
        // input value changed somewhat
    }

    @Override
    public void onBufferReceived(byte[] buffer) {
        System.out.println("Received audio for buffer.");
    }

    @Override
    public void onEndOfSpeech() {
        System.out.println("User finished talking.");
    }

    @Override
    public void onError(int error) {
    }

    @Override
    public void onResults(Bundle fullResults) {
        List<String> results = fullResults.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
        if(results != null && !results.isEmpty()) saidUser = results.get(0);
        threadedSpeak();
        try {
            Thread.sleep(2500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        mic.startListening(recognizerIntent);
    }

    @Override
    public void onPartialResults(Bundle partialResults) {
        List<String> results = partialResults.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
        if(results != null && !results.isEmpty()) saidUser = results.get(0);
        threadedSpeak();
        try {
            Thread.sleep(2500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        mic.startListening(recognizerIntent);
    }

    @Override
    public void onEvent(int eventType, Bundle params) {
        System.out.println("Some event or other occurred.");
    }
}
