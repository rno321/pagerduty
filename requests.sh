curl -v POST https://super-spork-69grwrw9p4724wg5-3000.app.github.dev/api/submit \
     -H "Content-Type: application/json" \
     -d '{"name": "John Doe", "email": "john@example.com"}'
l
curl -i https://super-spork-69grwrw9p4724wg5-3000.app.github.dev/api/hello

curl -i localhost:3000/api/hello


curl -i localhost:3000/api/submit\
     -H "Content-Type: application/json" \
     -d '{"name": "John Doe", "email": "john@example.com"}'

curl -i localhost:3000/api/receive_grafana\
     -H "Content-Type: application/json" \
     -d '{
            "alertName": "High CPU Usage",
            "message": "CPU usage is above 90%",
            "severity": "critical",
            "url": "http://grafana.example.com/alert"
            }'

